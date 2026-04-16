/**
 * Utilitários de validação para o sistema Carvex.
 *
 * Este arquivo contém funções simples usando Expressões Regulares (Regex) e
 * manipulação de strings para garantir que os dados enviados estejam no formato correto.
 */

/**
 * Valida o formato de um e-mail.
 * 
 * Como a Regex funciona:
 * ^         : Indica o início da string.
 * [^\s@]+   : Pega 1 ou mais (+) caracteres que NÃO sejam espaço em branco (\s) nem '@'.
 * @         : Exige exatamente um caractere '@'.
 * [^\s@]+   : Pega 1 ou mais (+) caracteres que NÃO sejam espaço em branco (\s) nem '@'.
 * \.        : Exige exatamente um ponto '.' (a barra invertida serve para escapar o ponto, pois na Regex ponto puro significa "qualquer caractere").
 * [^\s@]+   : Pega 1 ou mais (+) caracteres que NÃO sejam espaço em branco (\s) nem '@' para o final (ex: com, com.br).
 * $         : Indica o final da string.
 */
function validarEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida se uma string contém apenas números.
 * 
 * Como a Regex funciona:
 * ^      : Início da string.
 * \d+    : '\d' significa um dígito (0-9). O '+' significa 1 ou mais vezes.
 * $      : Final da string.
 */
function contemApenasNumeros(valor) {
  if (!valor) return false;
  const regex = /^\d+$/;
  return regex.test(String(valor));
}

/**
 * Retira tudo que não é número de uma string. Útil para limpar CPF, CNPJ, Telefone, etc.
 * 
 * Como a Regex funciona:
 * \D     : '\D' maiúsculo significa "tudo que NÃO é um dígito numérico" (ou seja, letras, traços, pontos, parênteses).
 * g      : Flag 'g' (global) diz "encontre/substitua TODOS os padrões na string" e não apenas o primeiro.
 */
function limparNaoNumeros(valor) {
  if (!valor) return '';
  return String(valor).replace(/\D/g, '');
}

/**
 * Valida o formato de uma placa de veículo brasileira.
 * Cobre tanto o padrão antigo (ABC-1234 ou ABC1234) quanto o padrão Mercosul (ABC1D23).
 * 
 * Como a Regex funciona:
 * ^             : Início da string.
 * [a-zA-Z]{3}   : Exatamente 3 ({3}) letras, podendo ser maiúsculas ou minúsculas (a-z, A-Z).
 * -?            : Um hífen opcional (a interrogação '?' significa que ele anterior pode aparecer 0 ou 1 vez).
 * [0-9]         : Exatamente 1 número (o primeiro número após a parte das letras).
 * [a-zA-Z0-9]   : Exatamente 1 letra ou número (no padrão antigo é número, no Mercosul é letra).
 * [0-9]{2}      : Exatamente 2 números no final.
 * $             : Final da string.
 */
function validarPlaca(placa) {
  if (!placa || typeof placa !== 'string') return false;
  // Expressão regular explicada acima
  const regex = /^[a-zA-Z]{3}-?[0-9][a-zA-Z0-9][0-9]{2}$/;
  return regex.test(placa);
}

/**
 * Valida um CPF baseando-se no tamanho e se ele contém apenas números (após limpo de pontos e traços).
 * Nota: Não faz a validação matemática complexa dos dígitos finais, já que focamos no MVP, mas impede coisas soltas.
 */
function validarCpfBasico(cpf) {
  if (!cpf) return false;
  const apenasNumeros = limparNaoNumeros(cpf);
  // O CPF brasileiro tem sempre 11 dígitos
  return apenasNumeros.length === 11;
}

/**
 * Valida um CNPJ baseando-se no tamanho e se ele contém apenas números (após limpo de pontos, barras e traços).
 */
function validarCnpjBasico(cnpj) {
  if (!cnpj) return false;
  const apenasNumeros = limparNaoNumeros(cnpj);
  // O CNPJ brasileiro tem sempre 14 dígitos
  return apenasNumeros.length === 14;
}

/**
 * Valida um telefone celular/fixo considerando o DDD. (ex: (11) 99999-9999 ou 11999999999).
 */
function validarTelefone(telefone) {
  if (!telefone) return false;
  const apenasNumeros = limparNaoNumeros(telefone);
  // 10 dígitos (Fixo com DDD) ou 11 dígitos (Celular com DDD)
  return apenasNumeros.length === 10 || apenasNumeros.length === 11;
}

/**
 * Valida o tamanho do CEP após remover caracteres não numéricos. (Pode vir como 00000-000 ou 00000000).
 */
function validarCep(cep) {
  if (!cep) return false;
  const apenasNumeros = limparNaoNumeros(cep);
  // CEP tem sempre 8 números
  return apenasNumeros.length === 8;
}

/**
 * Valida se uma string de texto não está em branco. (Evita que o usuário passe só espaços no input).
 * 
 * Como o trim() funciona: Remove todos os espaços do começo e do final da string.
 * Se o tamanho resultante for 0, então a string que o usuário digitou possuía apenas espaços vazios.
 */
function textoValido(texto) {
  if (!texto || typeof texto !== 'string') return false;
  return texto.trim().length > 0;
}

/**
 * Valida se a senha atende aos requisitos mínimos de segurança (apenas tamanho para o MVP).
 */
function validarSenha(senha) {
  if (!senha || typeof senha !== 'string') return false;
  // Mínimo de 6 caracteres
  return senha.length >= 6;
}

module.exports = {
  validarEmail,
  contemApenasNumeros,
  limparNaoNumeros,
  validarPlaca,
  validarCpfBasico,
  validarCnpjBasico,
  validarTelefone,
  validarCep,
  textoValido,
  validarSenha
};
