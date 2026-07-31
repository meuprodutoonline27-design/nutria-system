# Guia de instalação e publicação do NutriIA

## 1. Hospedagem recomendada
O app funciona como uma página estática e pode ser hospedado gratuitamente no GitHub Pages. Isso permite que o cliente use o sistema sem instalar nada manualmente e sem precisar baixar arquivos ZIP.

## 2. Publicar no GitHub Pages
1. Acesse o GitHub e crie um repositório para o projeto.
2. Faça o upload dos arquivos do app: [index.html](../index.html), [app.js](../app.js), [manifest.json](../manifest.json) e [service-worker.js](../service-worker.js).
3. No repositório, entre em Settings > Pages.
4. Em Source, selecione a branch principal e a pasta raiz.
5. Clique em Save. O GitHub irá gerar um link público do app.
6. Aguarde alguns minutos e use a URL fornecida para abrir o app.

## 3. Instalação no Android
1. Abra a URL no Google Chrome.
2. Toque nos 3 pontinhos (⋮) no canto superior direito.
3. Selecione "Adicionar à tela inicial".
4. Confirme e o ícone será criado na tela inicial como um app.

## 4. Instalação no iPhone (iOS)
1. Abra a URL no Safari.
2. Toque no botão de compartilhar.
3. Selecione "Adicionar à Tela de Início".
4. Confirme para criar o atalho do app.

## 5. Instalação no computador
1. Abra a URL no Chrome ou Edge.
2. Clique no ícone de instalar na barra de endereço.
3. Confirme a instalação.
4. O app abrirá como uma aplicação desktop.

## 6. Observação importante
Mesmo com o app hospedado, o sistema continua funcionando offline para o último cardápio salvo, graças ao armazenamento local do navegador.
