import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { EventFormModal } from '../EventFormModal';
import { useAppDispatch } from '../../../app/hooks';
import uiSlice from '../../../features/ui/uiSlice';

jest.mock('../../../app/hooks', () => ({
    ...jest.requireActual('../../../app/hooks'),
    useAppDispatch: jest.fn(),
}));

const mockUseAppDispatch = useAppDispatch as jest.Mock;

describe('EventFormModal', () => {
    let store: ReturnType<typeof configureStore>;
    const mockDispatch = jest.fn();

    beforeEach(() => {
        store = configureStore({
            reducer: {
                ui: uiSlice,
            },
        });
        mockUseAppDispatch.mockReturnValue(mockDispatch);
        mockDispatch.mockClear();
    });

    it('should not render when isOpen is false', () => {
        render(
            <Provider store={store}>
              <EventFormModal isOpen={false} onClose={() => {}} onSubmit={() => {}} />
            </Provider>
        );
        expect(screen.queryByTestId('modal-shell-mock')).not.toBeInTheDocument();
    });
});
