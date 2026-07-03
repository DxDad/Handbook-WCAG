import React, {useMemo, useState} from 'react';
import Layout from '@theme/Layout';
import DATA from '@site/src/data/data.json';
import styles from './index.module.css';

const CATEGORIA_LABEL = {
  teclado: 'Teclado e foco',
  'leitor-de-tela': 'Leitor de tela',
  formulario: 'Formulario',
  visual: 'Visual e contraste',
  movimento: 'Conteudo em movimento',
};
const COMPONENTE_LABEL = {
  botao: 'Botao',
  link: 'Link',
  formulario: 'Formulario',
  modal: 'Modal',
  imagem: 'Imagem',
  tabela: 'Tabela',
  menu: 'Menu',
  carrossel: 'Carrossel',
};
const ROLE_LABEL = {dev: 'Dev', qa: 'QA', ux: 'UX', conteudo: 'Conteudo'};

function normalizeText(t) {
  return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function Card({item, open, onToggle}) {
  const headingId = item.id + '-heading';
  const bodyId = item.id + '-body';
  return (
    <article className={styles.card} data-open={open}>
      <h3 className={styles.cardTitleWrap}>
        <button
          type="button"
          id={headingId}
          className={styles.cardHead}
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => onToggle(item.id)}>
          <span>
            <span className={styles.cardTitle}>{item.sintoma}</span>
            <span className={styles.desc}>{item.descricao_curta}</span>
            <span className={styles.pills}>
              <span className={styles.pill + ' ' + styles.pillCat}>
                {CATEGORIA_LABEL[item.categoria] || item.categoria}
              </span>
              {item.componentes.map((c) => (
                <span key={c} className={styles.pill + ' ' + styles.pillComp}>
                  {COMPONENTE_LABEL[c] || c}
                </span>
              ))}
              <span className={styles.pill + ' ' + styles['impacto-' + item.impacto]}>
                {'Impacto ' + item.impacto}
              </span>
              {(item.responsaveis || []).map((r) => (
                <span key={r} className={styles.pill + ' ' + styles.pillRole}>
                  {ROLE_LABEL[r] || r}
                </span>
              ))}
              {(item.wcag || []).map((w) => (
                <span key={w} className={styles.pill + ' ' + styles.pillWcag}>
                  {'WCAG ' + w}
                </span>
              ))}
            </span>
          </span>
          <span className={styles.chev} aria-hidden="true">
            {'▾'}
          </span>
        </button>
      </h3>
      <div
        id={bodyId}
        role="region"
        aria-labelledby={headingId}
        hidden={!open}
        className={styles.cardBody}>
        <div className={styles.boxes}>
          <div className={styles.box}>
            <h4>Causa provavel</h4>
            <ul>
              {item.causas_provaveis.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <div className={styles.box}>
            <h4>Solucao minima</h4>
            <ol>
              {item.solucao_minima.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ol>
          </div>
          <div className={styles.box}>
            <h4>Como validar</h4>
            <ul>
              {item.validacao.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
        {item.exemplo_codigo && (
          <pre className={styles.code}>
            <code>{item.exemplo_codigo}</code>
          </pre>
        )}
        {!(item.wcag && item.wcag.length) && (
          <p className={styles.wcagPending}>Criterio WCAG: a definir.</p>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [componente, setComponente] = useState('todos');
  const [openIds, setOpenIds] = useState(() => new Set());

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const term = normalizeText(search.trim());
    return DATA.filter((item) => {
      const haystack = normalizeText(
        [item.sintoma, item.descricao_curta, (item.keywords || []).join(' ')].join(' '),
      );
      const matchesTerm = !term || haystack.includes(term);
      const matchesCat = categoria === 'todos' || item.categoria === categoria;
      const matchesComp =
        componente === 'todos' || (item.componentes || []).includes(componente);
      return matchesTerm && matchesCat && matchesComp;
    });
  }, [search, categoria, componente]);

  return (
    <Layout
      title="Handbook A11Y - Sintoma, causa, solucao"
      description="Descreva o que voce esta vendo na tela. A gente te diz a causa provavel e a solucao minima, faceteado por categoria e componente.">
      <a className={styles.skip} href="#lista">
        Pular para a lista de sintomas
      </a>
      <header className={styles.header}>
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>Handbook de acessibilidade - view unificada</span>
          <h1 className={styles.h1}>Descreva o que voce esta vendo. A gente te diz o que fazer.</h1>
          <p className={styles.headerP}>
            Cada item combina duas facetas independentes - <strong>categoria</strong> (que tipo
            de problema) e <strong>componente</strong> (onde ele aparece) - alem de causa
            provavel, solucao minima e como validar.
          </p>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.n}>01</span>
              <strong>Descreva o sintoma</strong>
              <p>Busque pelo que percebeu na tela ou no teste.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.n}>02</span>
              <strong>Filtre por faceta</strong>
              <p>Categoria e componente combinam - pode usar os dois.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.n}>03</span>
              <strong>Abra a solucao</strong>
              <p>Causa, correcao minima e validacao, no proprio card.</p>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.finder}>
          <div className={styles.finderRow}>
            <div>
              <label htmlFor="search">Buscar sintoma</label>
              <input
                id="search"
                type="search"
                placeholder="Ex.: Tab, foco, imagem, botao, erro, modal, contraste..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}>
                <option value="todos">Todas</option>
                {Object.entries(CATEGORIA_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="componente">Componente</label>
              <select
                id="componente"
                value={componente}
                onChange={(e) => setComponente(e.target.value)}>
                <option value="todos">Todos</option>
                {Object.entries(COMPONENTE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.facetNote}>
            <span>
              <b className={styles.cat}>Categoria</b> = natureza do problema
            </span>
            <span>
              <b className={styles.comp}>Componente</b> = onde ele aparece na UI
            </span>
          </div>
        </div>

        <p className={styles.count} aria-live="polite">
          {filtered.length} de {DATA.length} itens
        </p>
        {filtered.length === 0 && (
          <div className={styles.empty}>Nenhum item encontrado. Tente outro termo ou combine menos filtros.</div>
        )}
        <div className={styles.list} id="lista">
          {filtered.map((item) => (
            <Card key={item.id} item={item} open={openIds.has(item.id)} onToggle={toggle} />
          ))}
        </div>

        <footer className={styles.footer}>
          <p>
            <strong>Sobre esta view:</strong> renderizada a partir de um schema canonico
            (<code>schema.json</code>) + dados (<code>data.json</code>). Os mesmos dados podem
            alimentar outras views (ex.: uma focada em criterios WCAG) ou uma API - nada aqui
            esta hardcoded na apresentacao.
          </p>
          <p>
            Conteudo canonico usa a redacao tecnica (fonte: prototipo WCAG verificado), ja que o
            publico-alvo sao designers/devs sem especializacao em a11y que precisam corrigir
            rapido algo ja apontado. O item "nome acessivel de botao" nao existe no prototipo
            WCAG original - WCAG 4.1.2 aqui e um candidato assumido, nao uma correspondencia
            verificada na fonte.
          </p>
        </footer>
      </main>
    </Layout>
  );
}
