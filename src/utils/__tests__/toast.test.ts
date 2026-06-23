import { toastSuccess, toastError } from '../toast';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { toast } from 'sonner';

describe('toast utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toastSuccess', () => {
    it('deve chamar toast.success com a mensagem correta', () => {
      const message = 'Operação realizada com sucesso!';
      toastSuccess(message);

      expect(toast.success).toHaveBeenCalledWith(message);
    });

    it('deve funcionar com mensagens vazias', () => {
      toastSuccess('');
      expect(toast.success).toHaveBeenCalledWith('');
    });
  });

  describe('toastError', () => {
    it('deve chamar toast.error com a mensagem correta', () => {
      const message = 'Erro ao realizar operação';
      toastError(message);

      expect(toast.error).toHaveBeenCalledWith(message);
    });

    it('deve funcionar com mensagens vazias', () => {
      toastError('');
      expect(toast.error).toHaveBeenCalledWith('');
    });
  });
});
