const express = require("express");
const router = express.Router();

const Posts = require('./data/db.js')


router.get('/', (req, res) => {
    Posts.find(req.params)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error retrieving posts data'
        });
    });
});

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the post',
      });
    });
  });

  router.post('/', (req, res) => {
    Posts.insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error adding the post',
      });
    });
  });

  router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Posts.remove(id);
    res.status(200).json({ message: 'Post removed' });
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedPost = req.body;
    Posts.update(id, updatedPost);
    res.status(200).json({ message: 'Post updated' });
})

  router.get('/:id/comments', (req, res) => {
    const id = req.params.id
    Posts.findPostComments(id)
    .then(comments => {
        res.status(200).json(comments);
    })
    .catch(err => {
        console.log('error: ', err );
        res.status(500).json({message: 'Error retrieving comments'});
    });
  });

  router.post('/:id/comments', (req, res) => {
    const comment = req.body;

    comment.post_id = req.params.id;

    Posts.insertComment(comment)
    .then(comment => {
        res.status(200).json(comment);
    })
    .catch(err => {
        console.log('error: ', err );
        res.status(500).json({
            message: 'Error retrieving comments'
        });
    });
  });


module.exports = router;