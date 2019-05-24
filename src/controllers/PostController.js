import { Post } from '../models';
import { statusCodes, responseMessages } from '../constants';

/**
 * @description Post Controller class
 */
export default class PostController {
  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async createPost(req, res) {
    const { currentUser, body } = req;
    const author = {
      username: currentUser.username,
      email: currentUser.email,
      image: currentUser.image,
    };

    const post = await Post.create({ ...body, author: currentUser._id });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      post: {
        ...post.toObject(),
        author,
        __v: undefined,
      },
      message: responseMessages.created('Post'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async updatePost(req, res) {
    const { currentUser, body, post } = req;

    if (!currentUser._id.equals(post.author._id)) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        status: statusCodes.UNAUTHORIZED,
        message: responseMessages.unauthorized(),
      });
    }

    await post.updateOne({ ...body });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      post: { ...post.toObject(), ...body },
      message: responseMessages.updated('Post'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async deletePost(req, res) {
    const { currentUser, post } = req;

    if (!currentUser._id.equals(post.author._id)) {
      return res.status(statusCodes.UNAUTHORIZED).json({
        status: statusCodes.UNAUTHORIZED,
        post,
        message: responseMessages.unauthorized(),
      });
    }

    await post.updateOne({ status: 'deleted' });

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      post,
      message: responseMessages.deleted('Post'),
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async getPost(req, res) {
    const { post } = req;

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      post,
    });
  }

  /**
   * @author Olivier
   * @param {Object} req
   * @param {Object} res
   * @param {*} next
   * @returns {Object} Returns the response
   */
  static async getPosts(req, res) {
    const posts = await Post.find({})
      .select('-__v')
      .populate('author', '-_id -__v -userType -password');

    return res.status(statusCodes.OK).json({
      status: statusCodes.OK,
      posts,
    });
  }
}