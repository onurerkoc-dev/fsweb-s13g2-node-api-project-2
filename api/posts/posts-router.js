const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Gönderiler alınamadı' });
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    }

    const comments = await Posts.findPostComments(req.params.id);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Yorumlar bilgisi getirilemedi' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Gönderi bilgisi alınamadı' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, contents } = req.body;

    if (!title || !contents) {
      return res
        .status(400)
        .json({ message: 'Lütfen gönderi için bir title ve contents sağlayın' });
    }

    const { id } = await Posts.insert({ title, contents });
    const post = await Posts.findById(id);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Veritabanına kaydedilirken bir hata oluştu' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }

    const { title, contents } = req.body;

    if (!title || !contents) {
      return res
        .status(400)
        .json({ message: 'Lütfen gönderi için title ve contents sağlayın' });
    }

    await Posts.update(req.params.id, { title, contents });
    const updatedPost = await Posts.findById(req.params.id);

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Gönderi bilgileri güncellenemedi' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Belirtilen ID li gönderi bulunamadı' });
    }

    await Posts.remove(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Gönderi silinemedi' });
  }
});

module.exports = router;
