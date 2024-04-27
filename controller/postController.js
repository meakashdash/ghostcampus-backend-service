import { ObjectId } from "mongodb";
import { MongoDBService } from "../services/MongoDBService.js";
import { S3Service } from "../services/S3Service.js";
import { BUCKET_NAME, TABLE_NAMES } from "../utils/config.js";
import moment from "moment";

const mongoDBService = new MongoDBService();
const s3Service = new S3Service();
export const createPost = async (req, res) => {
  try {
    const { userId } = req.user;
    const { tagId } = req.body;
    const media = {};
    const timestamp = Date.now().toString();
    if (req.files.images) {
      const imageKey = `images/${timestamp}`;
      const images = await s3Service.uploadImages(
        req.files,
        BUCKET_NAME,
        "posts",
        imageKey
      );
      media.images = images;
    }
    if (req.files.videos) {
      const videoKey = `videos/${timestamp}`;
      const videos = await s3Service.uploadVideos(
        req.files,
        BUCKET_NAME,
        "posts",
        videoKey
      );
      media.videos = videos;
    }
    const tagResponse = await mongoDBService.getItem(TABLE_NAMES.TAGS, tagId);
    const postItem = {
      _id: new ObjectId(),
      userId: userId,
      title: req.body.title,
      tagColor: tagResponse.color,
      tagText: tagResponse.text,
      media: media,
      postType: "post",
      createdAt: new Date(),
    };
    const createPostResponse = await mongoDBService.createItem(
      TABLE_NAMES.POSTS,
      postItem
    );
    if (!createPostResponse) {
      return res.json({
        statusCode: 401,
        message: "Unable to Post.Try again",
      });
    }
    return res.json({
      statusCode: 200,
      message: "Post Created Successfully",
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    let posts = await mongoDBService.getAllItem(TABLE_NAMES.POSTS);
    if (!posts) {
      return res.json({
        statusCode: 401,
        message: "Unable to Load Posts",
      });
    }
    let postWithDetails = await Promise.all(
      posts.map(async (post) => {
        const user = await mongoDBService.getItem(
          TABLE_NAMES.USERS,
          post.userId
        );

        const userProfile = {
          userName: user.userName,
          userId: user._id,
          profilePhoto: user.profilePhoto ? user.profilePhoto : "",
        };
        let likeCount = await mongoDBService.findAllDocument(
          TABLE_NAMES.LIKES,
          "postId",
          post._id.toString()
        );
        likeCount = likeCount ? likeCount.length : 0;
        const query = {
          postId: post._id.toString(),
        };
        let commentCount = await mongoDBService.findByQueryArray(
          TABLE_NAMES.COMMENT,
          query
        );
        commentCount = commentCount ? commentCount.length : 0;
        const timeAgo = moment(post.createdAt).fromNow();
        return {
          ...post,
          ...userProfile,
          likeCount: likeCount,
          commentCount: commentCount,
          timeAgo,
        };
      })
    );
    postWithDetails = await mongoDBService.paginate(
      postWithDetails,
      Number(req.query.page),
      10
    );
    return res.json({
      statusCode: 200,
      postWithDetails,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const hitLikeDislike = async (req, res) => {
  try {
    const { postId } = req.body;
    const { userId } = req.user;

    let isLikeExist = await mongoDBService.findAllDocument(
      TABLE_NAMES.LIKES,
      'postId',
      postId
    );

    if (!Array.isArray(isLikeExist)) {
      isLikeExist = [isLikeExist];
    }

    const isUserLiked = isLikeExist.some((likedPost) => {
      return likedPost.userId === userId;
    });
    if (!isUserLiked) {
      const likeItem = {
        _id: new ObjectId(),
        postId: postId,
        userId: userId,
      };

      const createLikeResponse = await mongoDBService.createItem(
        TABLE_NAMES.LIKES,
        likeItem
      );

      //check the user disliked or not
      let isDisLikeExist = await mongoDBService.findAllDocument(
        TABLE_NAMES.DOWNVOTE,
        'postId',
        postId
      );

      const isUserDisLiked = isDisLikeExist.some((disLikedPost) => {
        return disLikedPost.userId === userId;
      });

      if(isUserDisLiked){
        const userDislike = isDisLikeExist.filter((likedPost) => {
          return likedPost.userId === userId;
        });
        const deleteResponse = await mongoDBService.deleteItem(
          TABLE_NAMES.DOWNVOTE,
          '_id',
          userDislike[0]?._id
        );
        console.log("Deleted the Dislike");
      }

      if (!createLikeResponse) {
        return res.json({
          statusCode: 401,
          message: 'Unable to like the post. Try again',
        });
      }

      return res.json({
        statusCode: 200,
        message: 'Liked the post successfully',
        length:isLikeExist.length
      });
    } else {
      const userLike = isLikeExist.filter((likedPost) => {
        return likedPost.userId === userId;
      });
      const deleteResponse = await mongoDBService.deleteItem(
        TABLE_NAMES.LIKES,
        '_id',
        userLike[0]._id
      );

      if (!deleteResponse) {
        return res.json({
          statusCode: 402,
          message: 'Unable to dislike the post. Try again',
        });
      }

      return res.json({
        statusCode: 200,
        message: 'Disliked the post successfully',
      });
    }
  } catch (error) {
    return res.json({ statusCode: 400, message: error.message });
  }
};

export const hitBookmark=async(req,res)=>{
  try {
    const { postId } = req.body;
    const { userId } = req.user;

    let isBookmarkExist = await mongoDBService.findAllDocument(
      TABLE_NAMES.BOOKMARK,
      'postId',
      postId
    );

    if (!Array.isArray(isBookmarkExist)) {
      isBookmarkExist = [isBookmarkExist];
    }

    const isUserBookmarked = isBookmarkExist.some((bookmarkedPost) => {
      return bookmarkedPost.userId === userId;
    });
    if (!isUserBookmarked) {
      const bookmarkItem = {
        _id: new ObjectId(),
        postId: postId,
        userId: userId,
      };

      const createBookmarkResponse = await mongoDBService.createItem(
        TABLE_NAMES.BOOKMARK,
        bookmarkItem
      );

      if (!createBookmarkResponse) {
        return res.json({
          statusCode: 401,
          message: 'Unable to bookmark the post. Try again',
        });
      }

      return res.json({
        statusCode: 200,
        message: 'Bookmarked the post successfully',
      });
    } else {
      const userLike = isBookmarkExist.filter((bookmarkedPost) => {
        return bookmarkedPost.userId === userId;
      });
      const deleteResponse = await mongoDBService.deleteItem(
        TABLE_NAMES.BOOKMARK,
        '_id',
        userLike[0]._id
      );

      if (!deleteResponse) {
        return res.json({
          statusCode: 402,
          message: 'Unable to unsave the post. Try again',
        });
      }

      return res.json({
        statusCode: 200,
        message: 'Unsave the post successfully',
      });
    }
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
}

export const createComment = async (req, res) => {
  try {
    const { postId, message } = req.body;
    const { userId } = req.user;

    const userDetails = await mongoDBService.getItem(TABLE_NAMES.USERS, userId);

    const commentItem = {
      _id: new ObjectId(),
      postId: postId,
      userId: userId,
      userName: userDetails.userName,
      profilePhoto: userDetails.profilePhoto ? userDetails.profilePhoto : "",
      message: message,
      parentCommentId: "",
      createdAt: new Date(),
    };

    const createCommentResponse = await mongoDBService.createItem(
      TABLE_NAMES.COMMENT,
      commentItem
    );

    if (!createCommentResponse) {
      return res.json({
        statusCode: 401,
        message: "Unable to comment on the post. Please try again",
      });
    }

    return res.json({
      statusCode: 200,
      message: "Commented the post",
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId, message } = req.body;
    const { userId } = req.user;
    const { checkUserId } = req.query;

    if (!message) {
      return res.json({
        statusCode: 401,
        message: "Comment can not be empty",
      });
    }

    if (userId !== checkUserId) {
      return res.json({
        statusCode: 403,
        message: "Unauthorized Access",
      });
    }

    const comment = await mongoDBService.getItem(
      TABLE_NAMES.COMMENT,
      commentId
    );

    if (!comment) {
      return res.json({
        statusCode: 402,
        message: "Comment does not exist",
      });
    }

    const filter = { _id: new ObjectId(commentId) };
    const updateOperation = { $set: { message: message } };

    const updateResponse = await mongoDBService.addItemQuery(
      TABLE_NAMES.COMMENT,
      filter,
      updateOperation
    );

    if (!updateResponse) {
      return res.json({
        statusCode: 404,
        message: "Unable to update the comment. Please try again",
      });
    }

    return res.json({
      statusCode: 200,
      message: "Comment Updated Successfully",
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const { userId } = req.user;
    const { checkUserId } = req.query;

    if (userId !== checkUserId) {
      return res.json({
        statusCode: 403,
        message: "Unauthorized Access",
      });
    }

    const deleteCommentResponse = await mongoDBService.deleteItem(
      TABLE_NAMES.COMMENT,
      "_id",
      new ObjectId(commentId)
    );

    if (!deleteCommentResponse) {
      return res.json({
        statusCode: 401,
        message: "Unable to delete comment. Please try again",
      });
    }

    const childComments = await mongoDBService.findByUniqueValue(
      TABLE_NAMES.COMMENT,
      "parentCommentId",
      commentId
    );

    if (childComments) {
      const deleteChildCommentsPromises = childComments.map(
        async (childComment) => {
          await mongoDBService.deleteItem(
            TABLE_NAMES.COMMENT,
            "_id",
            childComment._id
          );
        }
      );

      await Promise.all(deleteChildCommentsPromises);
    }

    return res.json({
      statusCode: 200,
      message: "Comments deleted successfully",
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const replyComment = async (req, res) => {
  try {
    const { commentId, message, postId } = req.body;
    const { userId } = req.user;

    const userDetails = await mongoDBService.getItem(TABLE_NAMES.USERS, userId);

    const commentItem = {
      _id: new ObjectId(),
      postId: postId,
      userId: userId,
      userName: userDetails.userName,
      profilePhoto: userDetails.profilePhoto ? userDetails.profilePhoto : "",
      message: message,
      parentCommentId: commentId,
      createdAt: new Date(),
    };

    const createCommentResponse = await mongoDBService.createItem(
      TABLE_NAMES.COMMENT,
      commentItem
    );

    if (!createCommentResponse) {
      return res.json({
        statusCode: 401,
        message: "Unable to reply on the comment. Please try again",
      });
    }

    return res.json({
      statusCode: 200,
      message: "Reply to the Comment Successfully",
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const getAllComment = async (req, res) => {
  try {
    const { postId } = req.params;

    const query = {
      postId: postId,
      parentCommentId: "",
    };

    const comments = await mongoDBService.findByQueryArray(
      TABLE_NAMES.COMMENT,
      query
    );

    return res.json({
      statusCode: 200,
      comments: comments,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const getReplyComments = async (req, res) => {
  try {
    const { commentId } = req.params;

    const query = {
      parentCommentId: commentId,
    };

    const comments = await mongoDBService.findByQueryArray(
      TABLE_NAMES.COMMENT,
      query
    );

    return res.json({
      statusCode: 200,
      comments: comments,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const getUserLikes = async (req, res) => {
  try {
    const { userId } = req.user;
    const allLikes=await mongoDBService.findAllDocument(
      TABLE_NAMES.LIKES,
      'userId',
      userId
    )
    const postIds = allLikes.map(like => like.postId);
    return res.json({
      statusCode: 200,
      likes: postIds,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const getUserBookmarks = async (req, res) => {
  try {
    const { userId } = req.user;
    const allBookmarks=await mongoDBService.findAllDocument(
      TABLE_NAMES.BOOKMARK,
      'userId',
      userId
    )
    const postIds = allBookmarks.map(like => like.postId);
    return res.json({
      statusCode: 200,
      bookmarks: postIds,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
};

export const hitDownvote=async(req,res)=>{
  try {
    const { postId } = req.body;
    const { userId } = req.user;

    let isDownvoteExist = await mongoDBService.findAllDocument(
      TABLE_NAMES.DOWNVOTE,
      'postId',
      postId
    );

    if (!Array.isArray(isDownvoteExist)) {
      isDownvoteExist = [isDownvoteExist];
    }

    const isUserDownvoted = isDownvoteExist.some((downvotePost) => {
      return downvotePost.userId === userId;
    });
    if (!isUserDownvoted) {
      const downvoteItem = {
        _id: new ObjectId(),
        postId: postId,
        userId: userId,
      };

      const createDownvoteResponse = await mongoDBService.createItem(
        TABLE_NAMES.DOWNVOTE,
        downvoteItem
      );

      //check if the like exist for that user in that post
      let isLikeExist = await mongoDBService.findAllDocument(
        TABLE_NAMES.LIKES,
        'postId',
        postId
      );

      const isUserLiked = isLikeExist.some((likedPost) => {
        return likedPost.userId === userId;
      });

      if(isUserLiked){
        const userLike = isLikeExist.filter((likedPost) => {
          return likedPost.userId === userId;
        });
        const deleteResponse = await mongoDBService.deleteItem(
          TABLE_NAMES.LIKES,
          '_id',
          userLike[0]._id
        );
        console.log("Deleted the Like");
      }
      //

      if (!createDownvoteResponse) {
        return res.json({
          statusCode: 401,
          message: 'Unable to downvote the post. Try again',
        });
      }

      return res.json({
        statusCode: 200,
        message: 'Downvote the post successfully',
      });
    } else {
      const userDownvote = isDownvoteExist.filter((downvotePost) => {
        return downvotePost.userId === userId;
      });
      const deleteResponse = await mongoDBService.deleteItem(
        TABLE_NAMES.DOWNVOTE,
        '_id',
        userDownvote[0]._id
      );

      if (!deleteResponse) {
        return res.json({
          statusCode: 402,
          message: 'Unable to remove downvote. Try again',
        });
      }

      return res.json({
        statusCode: 200,
        message: 'Remove downvote from the post successfully',
      });
    }
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
}

export const getUserDownvote=async(req,res)=>{
  try {
    const { userId } = req.user;
    const allDownvotes=await mongoDBService.findAllDocument(
      TABLE_NAMES.DOWNVOTE,
      'userId',
      userId
    )
    const postIds = allDownvotes.map(like => like.postId);
    return res.json({
      statusCode: 200,
      downvotes: postIds,
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      message: error.message,
    });
  }
}
