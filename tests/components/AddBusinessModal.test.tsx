import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddBusinessModal } from '../../src/features/businesses/AddBusinessModal';

describe('AddBusinessModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <AddBusinessModal
        isOpen={false}
        onClose={vi.fn()}
        onAddBusiness={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal dialog when isOpen is true', () => {
    render(
      <AddBusinessModal
        isOpen={true}
        onClose={vi.fn()}
        onAddBusiness={vi.fn()}
      />
    );
    expect(screen.getByText('Add Business Location')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Apex Health Center/i)).toBeInTheDocument();
  });

  it('calls onAddBusiness with valid location payload on submit', () => {
    const handleAddBusiness = vi.fn();
    const handleClose = vi.fn();

    render(
      <AddBusinessModal
        isOpen={true}
        onClose={handleClose}
        onAddBusiness={handleAddBusiness}
      />
    );

    const nameInput = screen.getByPlaceholderText(/e\.g\. Apex Health Center/i);
    const cityInput = screen.getByPlaceholderText(/seattle/i);

    fireEvent.change(nameInput, { target: { value: 'New Test Studio' } });
    fireEvent.change(cityInput, { target: { value: 'Portland' } });

    const submitBtn = screen.getByRole('button', { name: /add & synchronize/i });
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    expect(handleAddBusiness).toHaveBeenCalledTimes(1);
    expect(handleAddBusiness).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Test Studio',
        address: expect.objectContaining({ city: 'Portland' }),
        syncStatus: 'synced',
        isMock: true,
      })
    );
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

