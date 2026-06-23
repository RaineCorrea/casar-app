import { guestSchema } from '../guestSchema';
import { z } from 'zod';

describe('guestSchema', () => {
  const validData = {
    name: 'João Silva',
    telefone: '21997000228',
    email: 'joao@example.com',
  };

  describe('validação de nome', () => {
    it('deve aceitar nome completo válido', () => {
      const result = guestSchema.parse(validData);
      expect(result.name).toBe('João Silva');
    });

    it('deve recusar nome curto', () => {
      const data = { ...validData, name: 'Jo' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar nome com apenas um sobrenome curto', () => {
      const data = { ...validData, name: 'João S' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar nome com números', () => {
      const data = { ...validData, name: 'João123 Silva' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar nome com caracteres especiais', () => {
      const data = { ...validData, name: 'João@Silva' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve aceitar nome com acentos', () => {
      const data = { ...validData, name: 'João da Silva Sérgio' };
      const result = guestSchema.parse(data);
      expect(result.name).toBe('João da Silva Sérgio');
    });

    it('deve recusar nome menor que 3 caracteres', () => {
      const data = { ...validData, name: 'Jo' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar nome maior que 100 caracteres', () => {
      const data = {
        ...validData,
        name: 'a'.repeat(101),
      };
      expect(() => guestSchema.parse(data)).toThrow();
    });
  });

  describe('validação de telefone', () => {
    it('deve aceitar telefone válido com 10 dígitos', () => {
      const data = { ...validData, telefone: '21970220000' };
      const result = guestSchema.parse(data);
      expect(result.telefone).toBe('21970220000');
    });

    it('deve aceitar telefone válido com 11 dígitos', () => {
      const data = { ...validData, telefone: '21997000228' };
      const result = guestSchema.parse(data);
      expect(result.telefone).toBe('21997000228');
    });

    it('deve remover formatação do telefone', () => {
      const data = { ...validData, telefone: '(21) 99700-0228' };
      const result = guestSchema.parse(data);
      expect(result.telefone).toBe('21997000228');
    });

    it('deve recusar telefone com DDD inválido', () => {
      const data = { ...validData, telefone: '10997000228' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar telefone com menos de 10 dígitos', () => {
      const data = { ...validData, telefone: '219970228' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar telefone com mais de 11 dígitos', () => {
      const data = { ...validData, telefone: '219970002280' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar telefone com dígitos repetidos', () => {
      const data = { ...validData, telefone: '99999999999' };
      expect(() => guestSchema.parse(data)).toThrow();
    });
  });

  describe('validação de email', () => {
    it('deve aceitar email válido', () => {
      const result = guestSchema.parse(validData);
      expect(result.email).toBe('joao@example.com');
    });

    it('deve converter email para minúsculas', () => {
      const data = { ...validData, email: 'JoAo@ExAmPlE.cOm' };
      const result = guestSchema.parse(data);
      expect(result.email).toBe('joao@example.com');
    });

    it('deve fazer trim do email', () => {
      const data = { ...validData, email: '  joao@example.com  ' };
      const result = guestSchema.parse(data);
      expect(result.email).toBe('joao@example.com');
    });

    it('deve recusar email sem @', () => {
      const data = { ...validData, email: 'joaoexample.com' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar email sem domínio', () => {
      const data = { ...validData, email: 'joao@' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar email sem ponto no domínio', () => {
      const data = { ...validData, email: 'joao@example' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar email com espaços', () => {
      const data = { ...validData, email: 'joao @example.com' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar email com caracteres inválidos', () => {
      const data = { ...validData, email: 'joão<>@example.com' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar email maior que 254 caracteres', () => {
      const data = {
        ...validData,
        email: `${'a'.repeat(240)}@${'b'.repeat(13)}.com`,
      };
      expect(() => guestSchema.parse(data)).toThrow();
    });
  });

  describe('validação de campos obrigatórios', () => {
    it('deve recusar nome vazio', () => {
      const data = { ...validData, name: '' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar telefone vazio', () => {
      const data = { ...validData, telefone: '' };
      expect(() => guestSchema.parse(data)).toThrow();
    });

    it('deve recusar email vazio', () => {
      const data = { ...validData, email: '' };
      expect(() => guestSchema.parse(data)).toThrow();
    });
  });
});
