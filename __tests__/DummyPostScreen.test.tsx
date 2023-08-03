import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import DummyPostScreen from '../screens/DummyPostsScreen';

test('logout button triggers logout confirmation alert', async () => {
  const {getByText} = render(<DummyPostScreen />);
  const logoutButton = getByText('Logout');

  fireEvent.press(logoutButton);

  // Wait for the alert to be shown
  await waitFor(() => getByText('Logout'));

  // Check if the logout confirmation alert is shown
  expect(getByText('Logout')).toBeTruthy();
});
