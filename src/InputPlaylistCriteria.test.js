import React from 'react';
import { render } from '@testing-library/react';
import InputPlaylistCriteria from './InputPlaylistCriteria';

test('renders learn react link', () => {
  const { getByText } = render(<InputPlaylistCriteria />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
