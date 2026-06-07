import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders App component without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});