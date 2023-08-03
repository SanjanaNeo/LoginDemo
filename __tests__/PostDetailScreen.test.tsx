import React from 'react';
import { render, waitFor,fireEvent } from '@testing-library/react-native';
import PostDetailScreen from '../screens/PostDetailScreen';

const mockPost = {
  id: 1,
  title: 'Mock Post Title',
  body: 'Mock Post Body',
};

// Mock the fetch function to return the mockPost when the URL is called
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockPost),
  })
);

describe('PostDetailScreen', () => {
  test('displays post details', async () => {
    const { getByText } = render(<PostDetailScreen route={{ params: { postId: 1 } }} />);

    // Wait for the component to fetch and render the post details
    await waitFor(() => getByText('Mock Post Title'));
    getByText('Mock Post Body');
  });

  test('displays loading indicator when post details are being fetched', async () => {
    const { getByTestId } = render(<PostDetailScreen route={{ params: { postId: 1 } }} />);

    // Check if the loading indicator is displayed
    getByTestId('loading-indicator');
  });
});
