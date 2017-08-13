import React from 'react';
import {configure, addDecorator} from '@storybook/react';

const ctx = require.context('../app/', true, /\.stories\.js$/);

const wrapper = (story) => <div style={{padding: 10}}>{story()}</div>;
addDecorator(wrapper);

function loadStories() {
    ctx.keys().forEach(filename => ctx(filename));
}

configure(loadStories, module);