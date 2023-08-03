import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
test('email input should change when text is entered', () => {
  const {getByPlaceholderText} = render(<LoginScreen />);

  const emailInput = getByPlaceholderText('Email');
  const newEmail = 'test@example.com';

  fireEvent.changeText(emailInput, newEmail);

  expect(emailInput.props.value).toBe(newEmail);
});

test('password input should change when text is entered', () => {
  const {getByPlaceholderText} = render(<LoginScreen />);

  const passwordInput = getByPlaceholderText('Password');
  const newPassword = 'testPassword';

  fireEvent.changeText(passwordInput, newPassword);

  expect(passwordInput.props.value).toBe(newPassword);
});
