const express = require("express");
const router = express.Router();

const Posts = require('./data/db.js')


router.get('/', (req, res) => {
    Posts.find(req.params)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.log('error: ', err);
        res.status(500).json({
            message: 'Error retrieving posts data'
        });
    });
});

router.get('/:id', (req, res) => {
    const postId = req.params.id;

    Posts.findById(postId)
    .then(post => {
      post[0] 
      ? res.status(200).json(post)
      : res.status(404).json({ message: 'The post with the specified ID does not exist.' }) 
    })
    .catch(error => {
      console.log(error);
      res.status(500).json([{
        message: 'Error retrieving the post',
      }]);
    });
  });

router.post('/', (req, res) => {
  const newPost = req.body;
  if(!newPost.title || !newPost.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
  }
  Posts.insert(newPost)
  .then(post => {
    res.status(201).json(post)
  })
  .catch(err => {
    // log error to database
    console.log(err);
    res.status(500).json({
      message: 'Error adding the post',
    });
  });
});

router.put('/:id', (req, res) => {
  const postId = req.params.id;
  const updatedPost = req.body;

  if(!updatedPost.title || !updatedPost.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    });
  }

  Posts.findById(postId)
  .then(post => {
    !post[0] 
    ? res.status(404).json({ message: 'The post with the specified ID does not exist.' }) 
    : Posts.update(postId, updatedPost)
    .then(res.status(200).json(updatedPost))
    .catch(err => {
      console.log('error: ', err);
      res.status(500).json({ error: 'The post information could not be modified'})
    });
  })
});

router.delete('/:id', (req, res) => {
  const postId = req.params.id;

  Posts.findById(postId)
  .then(post => {
    !post[0]
    ? res.status(404).json({ message: 'that post does not exist'})
    : Posts.remove(postId)
    .then(res.status(200).json({ message: 'Post removed' }))
    .catch(err => {
      console.log('error: ', err);
      res.status(500).json({ error: 'The post could not be removed.' })
    })
  })
});

router.get('/:id/comments', (req, res) => {
  const postId = req.params.id
  
  Posts.findById(postId)
  .then(post => {
    !post[0]
    ?res.status(404).json({ message: 'The post with the specified ID does not exist.' })
    : Posts.findPostComments(postId)
    .then(comments => {
        comments[0]
        ?res.status(200).json(comments)
        :res.status(404).json({ message: 'The post with the specified ID does not have comments.' });
    })
  })
  .catch(err => {
      console.log('error: ', err );
      res.status(500).json({message: 'Error retrieving comments'});
  });
});

router.post('/:id/comments', (req, res) => {
  const postId = req.params.id;
  const comment = req.body;
  comment.post_id = req.params.id;

  if(!comment.text) {
    res.status(404).json({ errorMessage: "Please provide text for the comment."})
  };

    Posts.findById(postId)
    .then(post => {
      !post
      ? res.status(404).json({ message: 'Post not found' })
      : Posts.insertComment(comment)
      .then(res.status(200).json(comment))
      .catch(err => console.log('error: ', err))
    })
    .catch(err => {
      console.log('error: ', err);
      res.status(500).json({
        message: 'Error posting comment'
      })
    });
});


module.exports = router;