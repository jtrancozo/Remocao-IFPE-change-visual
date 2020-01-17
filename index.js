// ==UserScript==
// @name         Remoção IFPE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script pára mudar a visualização do sistema de remoção do IFPE
// @author       Jonathan Trancozo - IFPE
// @match        https://remocao.ifpe.edu.br/inscricao/publico/edital/1/periodos
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Get the first script tag
    var ref = document.querySelector('script');
    const body = document.querySelector('body');

    var style = document.createElement('style');
    style.innerHTML = `
       .card-vaga {display: flex; space-between; margin-bottom: 15px}
       .data {background-color: #006064; color: #fff; padding: 10px; margin: 40px 0 15px; font-weight: 500; font-size: 15px; display: inline-block; }
       .data:first-child {margin-top: 0}
       .vaga, .quantidade-vagas {color: #444; padding: 10px 15px; }
       .vaga { margin-left: 15px; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);}
       .quantidade-vagas { display: inline-block; padding-left: 10px; font-weight: 700; flex-basis: 100px}
       #visualization {border-left: 1px solid #006064; }
    `;

    ref.parentNode.insertBefore(style, ref);

    const visualization = document.querySelector('#visualization');
    // empty visualization
    visualization.innerHTML = '';

    // items está no código fonte da página
    const vagas = items._data ? Object.values(items._data): [];

    // functions
    let sortedVagas = vagas.slice().sort((a, b) => new Date(b.start) - new Date(a.start));

    // remove as datas iguais do array
    sortedVagas = sortedVagas.map((el, index) => {
        if (sortedVagas[index - 1]) {
            return el.start === sortedVagas[index - 1].start ? Object.assign(el, {start: ''}) : el;
        } else {
            return el;
        }
    });

    let templateVaga = function (vaga) {
        let vagasString = vaga.qtd_vagas + ' Vaga' + ((vaga.qtd_vagas > 1) ? 's' : '');
        let vagaStart = (vaga.start) ? `<h3 class="data">${vaga.start}</h3>` : ''
        return `
        ${vagaStart}
        <div class="card-vaga">
          <a class="vaga" rel="${vaga.id}" href="${vaga.url}" target="_blank">${vaga.descricao}</a>
          <span class="quantidade-vagas">${vagasString}</span>
       </div>
    `};

    const markupVagas = sortedVagas.map((vaga) => templateVaga(vaga)).join('');

    visualization.innerHTML = markupVagas;

})();
