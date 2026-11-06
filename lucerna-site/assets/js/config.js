/*
 * Dados comerciais da Lucerna — preencha só com informações confirmadas pelo cliente.
 * Campos vazios não aparecem no site; no lugar deles aparece um aviso de "pendente".
 */
window.LUCERNA_CONFIG = {
  /*
   * Logo aprovada: aguardando o arquivo original limpo (sem marca d'água), exportado pela
   * plataforma onde foi criada. NÃO use logo-lucerna-referencia-cliente.png aqui.
   * Quando chegar, salve em assets/img/ e informe os caminhos:
   *   claro:  versão para fundo claro (cabeçalho off-white)
   *   escuro: versão para fundo escuro (rodapé azul-petróleo). Se houver uma só, repita o caminho.
   */
  logo: { claro: "", escuro: "" },

  telefone: "",   // ex.: "(00) 0000-0000"
  whatsapp: "",   // só números, com DDI e DDD. Ex.: "5500000000000"
  email: "",
  endereco: "",
  instagram: "",  // URL completa
  facebook: "",   // URL completa

  /*
   * Destino do formulário de contato. Sem ele, o formulário valida os campos mas avisa que o
   * envio ainda não está ativo. Opções:
   *   formEndpoint: URL que recebe POST (ex.: Formspree, função serverless, backend próprio)
   *   ou, se só houver whatsapp, o formulário abre a conversa com a mensagem pronta.
   */
  formEndpoint: "",

  /* true esconde todos os avisos de "pendente" (use só quando os dados estiverem completos) */
  ocultarPendencias: false
};
