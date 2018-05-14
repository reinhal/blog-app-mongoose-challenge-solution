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





