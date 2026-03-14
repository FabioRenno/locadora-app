/**
 * Utilitários de validação para o Frontend.
 *
 * Estas funções espelham as validações do backend para fornecer feedback visual 
 * MAIS RÁPIDO ao usuário antes mesmo de tentarmos enviar os dados para o servidor.
 */

const Validacoes = {
  email: function(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  placa: function(placa) {
    // Aceita padrão antigo (ABC-1234) e Mercosul (ABC1D23)
    const regex = /^[a-zA-Z]{3}-?[0-9][a-zA-Z0-9][0-9]{2}$/;
    return regex.test(placa);
  },

  cpf: function(cpf) {
    const limpo = cpf.replace(/\D/g, '');
    return limpo.length === 11;
  },

  telefone: function(telefone) {
    const limpo = telefone.replace(/\D/g, '');
    return limpo.length === 10 || limpo.length === 11;
  },

  cep: function(cep) {
    const limpo = cep.replace(/\D/g, '');
    return limpo.length === 8;
  },

  senha: function(senha) {
    return senha && senha.length >= 6;
  },

  mostrarErroInput: function(inputElement, mensagem) {
    // Adiciona uma classe de erro para deixar a borda vermelha
    inputElement.classList.add('input-invalido');
    
    // Procura ou cria um elemento de mensagem embaixo do input
    let msgElement = inputElement.parentElement.querySelector('.msg-erro-input');
    if (!msgElement) {
      msgElement = document.createElement('div');
      msgElement.className = 'msg-erro-input';
      msgElement.style.color = '#dc3545';
      msgElement.style.fontSize = '0.875rem';
      msgElement.style.marginTop = '0.25rem';
      inputElement.parentElement.appendChild(msgElement);
    }
    msgElement.textContent = mensagem;
    msgElement.style.display = 'block';
  },

  limparErroInput: function(inputElement) {
    inputElement.classList.remove('input-invalido');
    const msgElement = inputElement.parentElement.querySelector('.msg-erro-input');
    if (msgElement) {
      msgElement.style.display = 'none';
    }
  },

  limparTodosErros: function(formElement) {
    const inputsInvalidos = formElement.querySelectorAll('.input-invalido');
    inputsInvalidos.forEach(input => this.limparErroInput(input));
  }
};
