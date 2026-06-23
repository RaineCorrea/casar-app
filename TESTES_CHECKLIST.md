# Checklist de Testes - FASE 1 e FASE 2

## FASE 1: Testes de Regressão

### 1. Formulário de RSVP
- [ ] Schema de validação está correto
- [ ] Campos são validados corretamente
- [ ] Mensagens de erro aparecem
- [ ] Prevenção de duplicatas funciona

### 2. Carrinho de Compras
- [ ] Adicionar produto funciona
- [ ] Remover produto funciona
- [ ] Atualizar quantidade funciona
- [ ] Total é calculado corretamente
- [ ] Carrinho abre/fecha corretamente

### 3. Toast Notifications
- [ ] Toast de sucesso aparece
- [ ] Toast de erro aparece
- [ ] Toast tem posição correta
- [ ] Toast desaparece automaticamente

### 4. Ordenação de Produtos
- [ ] Ordenar por preço (crescente)
- [ ] Ordenar por preço (decrescente)
- [ ] Ordenar A-Z
- [ ] Paginação funciona

### 5. Acessibilidade
- [ ] Navegação por teclado funciona
- [ ] Foco visível em elementos interativos
- [ ] ARIA labels presentes

### 6. Visual
- [ ] Cores estão corretas
- [ ] Fontes estão corretas
- [ ] Animações funcionam
- [ ] Responsividade mobile

## FASE 2: Testes de Integração Mercado Pago

### 1. Criação de Preferência
- [ ] API do Mercado Pago é chamada
- [ ] preference_id é retornado
- [ ] init_point é retornado

### 2. Redirecionamento
- [ ] Usuário é redirecionado para Mercado Pago
- [ ] URL de retorno está correta

### 3. Páginas de Retorno
- [ ] Página success funciona
- [ ] Página failure funciona
- [ ] Página pending funciona

### 4. Salvamento de Pedido
- [ ] Pedido é salvo no Supabase
- [ ] Dados do pedido estão corretos

## Resultado dos Testes

### FASE 1
- Visual: ✅ A SER TESTADO
- Funcionalidades: ✅ A SER TESTADO
- Build: ✅ PASSOU

### FASE 2
- Checkout: ✅ A SER TESTADO
- Páginas: ✅ CRIADAS
- Integração: ✅ IMPLEMENTADA
