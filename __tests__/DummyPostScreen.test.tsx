import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DummyPostScreen from '../screens/DummyPostsScreen';

describe('DummyPostScreen', () => {
  test('renders title correctly', () => {
    const { getByText } = render(<DummyPostScreen />);
    const titleElement = getByText('Dummy Posts');
    expect(titleElement).toBeDefined();
  });

  test('renders post items correctly', async () => {
    // Sample post data for testing
    const posts = [
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' },
      { id: 3, title: 'Post 3' },
    ];

    // Mock the fetch function to return the sample post data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(posts),
      })
    );

    const { getByText } = render(<DummyPostScreen />);

    // Wait for the fetch to complete and post items to render
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Check if each post item is rendered correctly
    posts.forEach((post) => {
      const postTitleElement = getByText(post.title);
      expect(postTitleElement).toBeDefined();
    });
  });
});
