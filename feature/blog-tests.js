'use strict';

const chai = require('chai');
const chaiHTTP = require('chaiHTTP');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHTTP);

function seedBlogData() {
    console.info('Seeding Blog Data');
    const seedData = [];

    for (let i = 0; i <= 10; i++) {
        seedData.push(generateBlogData());
    }

    return BlogPost.insertMany(seedData);
}

function generateBlogTitle() {
    const titles = [
        'Poor Old Tree', 'Trees Are Different', 'Happy Trees Here', 'One Hair Brush'];
    return titles[Math.floor(Math.random() * titles.length)];
}

function generateBlogAuthor() {
    const authors = [
    'Bob Street', 'Carla Branden', 'John Fresh', 'Harriet Paths', 'Pat Idunno'];
    return authors[Math.floor(Math.random() * authors.length)];
}

function generateBlogContent() {
    const contents = [
    'We\'ll throw some old gray clouds in here just sneaking around and having fun. Everybody\'s different. Trees are different. Let them all be individuals. We don\'t have to be concerned about it.',
    'A little happy sunlight shining through there. Each highlight must have it\'s own private shadow. You can do anything here. So don\'t worry about it.',
    'Let\'s make a happy little mountain now. That\'s a son of a gun of a cloud. Just use the old one inch brush.',
    'You could sit here for weeks with your one hair brush trying to do that - or you could do it with one stroke with an almighty brush. These trees are so much fun.',
    'I get started on them and I have a hard time stopping. Clouds are free. They just float around the sky all day and have fun. Almost everything is going to happen for you automatically - you don\'t have to spend any time working or worrying. In your imagination you can go anywhere you want.'];
    return contents[Math.floor(Math.random() * contents.length)];
}

function generateBlogData() {
    return {
        title: generateBlogTitle(),
        author: generateBlogAuthor(),
        content: generateBlogContent()
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Blog API source', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedBlogData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });
});

describe('GET endpoint', function() {

    it('should return all blog posts', function() {
        let res;
        return chai.request(app)
        .get('/posts')
        .then(function(_res) {
            res = _res;
            expect(res).to.have.status(200);
            expect(res.body.posts).to.have.lengthOf.at.least(1);
            return BlogPost.count();
        })
        .then (function(count) {
            expect(res.body.posts).to.have.lengthOf(count);
        });
    });

    it('should return blog posts with the right fields', function() {

        let resBlogPost;
        return chai.request(app)
        .get ('/posts')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body.posts).to.be.a('array');
            expect(res.body.posts).to.have.lengthOf.at.least(1);

            res.body.restaurants.forEach(function(posts) {
                expect(posts).to.be.a('object');
                expect(posts).to.be.include.keys(
                    'title', 'author', 'content');
            });
            resBlogPost =res.body.posts[0];
            return BlogPost.findById(resBlogPost.id);
        })
        .then(function(posts) {
            expect(resBlogPost.id).to.equal(posts.id);
            expect(resBlogPost.title).to.equal(posts.title);
            expect(resBlogPost.author).to.equal(posts.author);
            expect(resBlogPost.content).to.equal(posts.content);
        });
    });
});

describe('POST endpoint', function() {
    it('should add a new blog post', function() {

        const newBlogPost = generateBlogData();
        
        return chai.request(app)
            .post('/posts')
            .send(newBlogPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys(
                'title', 'author', 'content');
                expect(res.body.id).to.not.be.null;
                expect(res.body.title).to.equal(newBlogPost.title);
                expect(res.body.author).to.equal(newBlogPost.author);
                expect(res.body.content).to.equal(newBlogPost.content); 
        })
        .then(function(posts) {
            expect(posts.title).to.equal(newBlogPost.title);
            expect(posts.author).to.equal(newBlogPost.author);
            expect(posts.content).to.equal(newBlogPost.content);
        });
    });

    describe('PUT endpoint', function() {
        it('should update the fields that are sent over', function() {
            const updatePost = {
                title = 'Brand New Post',
                author = 'Some Person'
            };

            return BlogPost
                .findOne()
                .then(function(posts) {
                    updatePost.id = posts.id;

                    return chai.request(app)
                    .put(`/posts/${posts.id}`)
                    .send(updatePost);
                })
                .then(function(res) {
                    expect(res).to.have.status(204);

                    return BlogPost.findById(updatePost.id);
                })
                .then(function(posts) {
                    expect(posts.title).to.equal(updatePost.title);
                    expect(posts.author).to.equal(updatePost.author);
                });
        });
    });

    describe('DELETE endpoint', function() {
        it('delete a post by id', function() {
            let post;

            return BlogPost
                .findOne()
                .then(function(_post) {
                    post = _post;
                    return chai.request(app).delete(`/posts/${post.id}`);
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    return BlogPost.findById(post.id);
                })
                .then(function(_post) {
                    expect(_post).to.be.null;
                });
        });
    });
});
