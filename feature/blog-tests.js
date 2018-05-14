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




