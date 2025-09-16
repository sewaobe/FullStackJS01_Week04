const commentService = require('../services/commentService');

async function createComment(req, res) {
  try {
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { productId } = req.params;
    const { content, rating } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await commentService.createComment(
      userId,
      productId,
      content,
      rating,
    );
    return res.status(201).json(comment);
  } catch (err) {
    console.error('Error creating comment:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function listComments(req, res) {
  try {
    const { productId } = req.params;
    const comments = await commentService.getCommentsByProduct(productId);
    return res.json({ data: comments });
  } catch (err) {
    console.error('Error fetching comments:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createComment, listComments };
