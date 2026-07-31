# Modo White Label para o cliente

## O que é
O modo White Label permite que o nutricionista use o sistema com a sua própria marca, trocando o nome e a cor do cabeçalho.

## Como personalizar
1. Abra o app.
2. No início, preencha:
   - Nome do Profissional
   - Cor do Tema
3. O nome e a cor serão aplicados automaticamente no cabeçalho.

## Código principal
No formulário foram adicionados os campos:
- `nomeProfissional`
- `corTema`

O script salva esses valores no `localStorage` e aplica ao cabeçalho com:

```javascript
function aplicarTema() {
    const nome = document.getElementById('nomeProfissional')?.value?.trim() || 'NutriIA';
    const cor = document.getElementById('corTema')?.value || '#16a34a';
    const header = document.getElementById('appHeader');
    const title = document.getElementById('appTitle');

    if (header) {
        header.style.backgroundColor = cor;
    }

    if (title) {
        title.innerHTML = `<i class="fas fa-leaf mr-2"></i>${nome}`;
    }
}
```

## Dica de uso
O cliente pode colocar o nome da clínica ou do próprio profissional e escolher uma cor que combine com a marca.
