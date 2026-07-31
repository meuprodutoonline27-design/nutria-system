# Botão Enviar por WhatsApp

## Como funciona
O botão envia o cardápio completo para o WhatsApp com texto formatado.

## Código principal
```javascript
function montarTextoWhatsApp() {
    const dieta = dietaAtualExportavel || JSON.parse(localStorage.getItem('ultimaDieta') || 'null');
    if (!dieta || !dieta.cardapio) {
        return null;
    }

    const linhas = [];
    linhas.push('🍽️ Cardápio semanal NutriIA');
    linhas.push(`📌 Objetivo: ${dieta.objetivo || 'Não informado'}`);
    linhas.push(`🔥 TMB estimada: ${dieta.tmb ? `${dieta.tmb} kcal/dia` : 'Não informada'}`);
    linhas.push(`🎯 Meta estimada: ${dieta.meta || 'Não informada'}`);
    linhas.push('');

    dieta.cardapio.forEach(dia => {
        linhas.push(`📅 ${dia.dia}`);
        linhas.push(`☕ Café: ${dia.cafe}`);
        linhas.push(`🍽️ Almoço: ${dia.almoco}`);
        linhas.push(`🍎 Lanche: ${dia.lanche}`);
        linhas.push(`🌙 Jantar: ${dia.jantar}`);
        linhas.push('');
    });

    return linhas.join('\n');
}

function exportarWhatsApp() {
    const texto = montarTextoWhatsApp();
    if (!texto) return;

    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}
```

## Como adaptar para o cliente final
Você pode trocar a mensagem inicial do texto para algo mais profissional, por exemplo:

```javascript
linhas.push('🍽️ Cardápio personalizado da Dra. Ana');
```
