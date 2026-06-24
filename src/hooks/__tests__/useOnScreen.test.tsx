import { renderHook } from '@testing-library/react';
import { useOnScreen, useScrollAnimation, useLazyImage } from '../useOnScreen';

describe('useOnScreen', () => {
  it('deve retornar ref e isIntersecting false inicialmente', () => {
    const { result } = renderHook(() => useOnScreen());

    const [ref, isIntersecting] = result.current;
    expect(ref).toBeTruthy();
    expect(isIntersecting).toBe(false);
  });

  it('deve aceitar opções customizadas', () => {
    const options = {
      threshold: 0.5,
      rootMargin: '10px',
    };

    const { result } = renderHook(() => useOnScreen(options));

    const [ref, isIntersecting] = result.current;
    expect(ref).toBeTruthy();
    expect(isIntersecting).toBe(false);
  });
});

describe('useScrollAnimation', () => {
  it('deve retornar ref e isVisible false inicialmente', () => {
    const { result } = renderHook(() => useScrollAnimation());

    const [ref, isVisible] = result.current;
    expect(ref).toBeTruthy();
    expect(isVisible).toBe(false);
  });

  it('deve aceitar threshold customizado', () => {
    const { result } = renderHook(() => useScrollAnimation(0.8));

    const [ref, isVisible] = result.current;
    expect(ref).toBeTruthy();
    expect(isVisible).toBe(false);
  });

  it('deve aceitar rootMargin customizado', () => {
    const { result } = renderHook(() => useScrollAnimation(0.1, '20px'));

    const [ref, isVisible] = result.current;
    expect(ref).toBeTruthy();
    expect(isVisible).toBe(false);
  });
});

describe('useLazyImage', () => {
  it('deve retornar ref e imageSrc vazia inicialmente', () => {
    const { result } = renderHook(() => useLazyImage('image.jpg'));

    const [ref, imageSrc] = result.current;
    expect(ref).toBeTruthy();
    expect(imageSrc).toBe('');
  });

  it('deve aceitar src como parâmetro', () => {
    const src = 'https://example.com/image.jpg';
    const { result } = renderHook(() => useLazyImage(src));

    const [ref, imageSrc] = result.current;
    expect(ref).toBeTruthy();
    expect(imageSrc).toBe('');
  });

  it('deve aceitar threshold customizado', () => {
    const { result } = renderHook(() =>
      useLazyImage('image.jpg', 0.5)
    );

    const [ref, imageSrc] = result.current;
    expect(ref).toBeTruthy();
    expect(imageSrc).toBe('');
  });
});
