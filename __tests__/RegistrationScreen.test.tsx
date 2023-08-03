import 'react-native';
import React from 'react';
import RegistrationScreen from '../screens/RegistrationScreen';
import {render, fireEvent} from '@testing-library/react-native';

test('renders RegistrationScreen component', () => {
  const {getByText} = render(<RegistrationScreen />);
  const titleElement = getByText('Registration Screen');
  expect(titleElement).toBeTruthy();
});

test('enter email in input field', () => {
  const {getByPlaceholderText} = render(<RegistrationScreen />);
  const emailInput = getByPlaceholderText('Email');
  fireEvent.changeText(emailInput, 'test@example.com');
  expect(emailInput.props.value).toBe('test@example.com');
});

test('enter password in input field', () => {
  const {getByPlaceholderText} = render(<RegistrationScreen />);
  const passwordInput = getByPlaceholderText('Password');
  fireEvent.changeText(passwordInput, 'password123');
  expect(passwordInput.props.value).toBe('password123');
});