const axios = require('axios');

/**
 * Envia e-mail ao locador quando um motorista manifesta interesse
 * @param {string} locadorEmail - E-mail do locador
 * @param {object} dados - { veiculo, motorista }
 * @returns {Promise<boolean>} true se enviou, false se não configurado ou erro
 */
async function enviarEmailInteresse(locadorEmail, dados) {
  const { veiculo, motorista } = dados;
  const assunto = `Novo interesse: ${veiculo.marca} ${veiculo.modelo} - ${motorista.nome_completo}`;
  const texto = `
Um motorista demonstrou interesse no seu veículo.

VEÍCULO: ${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})

MOTORISTA: ${motorista.nome_completo}
WhatsApp: ${motorista.whatsapp}
E-mail: ${motorista.email}
CPF: ${motorista.cpf}

Acesse o painel para ver todos os dados e fazer a checagem:
${process.env.APP_URL || 'http://localhost:3000'}/interesses-locador.html
`;

  return enviarEmail({
    to: locadorEmail,
    subject: assunto,
    text: texto.trim()
  });
}

/**
 * Envia e-mail de recuperação de senha com link para redefinir
 * @param {string} para - E-mail do destinatário
 * @param {string} token - Token único para a redefinição
 * @param {string} tipo - 'locador' ou 'motorista'
 * @returns {Promise<boolean>} true se enviou
 */
async function enviarEmailRecuperacao(para, token, tipo) {
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  const pagRedefinir = tipo === 'locador' ? 'redefinir-senha-locador.html' : 'redefinir-senha-motorista.html';
  const link = `${baseUrl}/${pagRedefinir}?token=${encodeURIComponent(token)}`;
  const painel = tipo === 'locador' ? 'painel do locador' : 'painel do motorista';

  const assunto = 'Recuperação de senha - Locadora App';
  const texto = `
Você solicitou a recuperação de senha no Locadora App.

Para definir uma nova senha, acesse o link abaixo (válido por 2 horas):

${link}

Se você não solicitou essa recuperação, ignore este e-mail. Sua senha permanece a mesma.

Após redefinir, use o novo acesso para entrar no ${painel}.
`;

  return enviarEmail({
    to: para,
    subject: assunto,
    text: texto.trim()
  });
}

const MOTIVOS_DESISTENCIA = {
  fechou_outro: 'Fechou com outro locador',
  nao_atende: 'Não atende minhas necessidades',
  desistiu_busca: 'Desistiu da busca por enquanto',
  outro: 'Outro motivo'
};

/**
 * Envia e-mail ao locador quando um motorista desiste do interesse
 * @param {string} locadorEmail - E-mail do locador
 * @param {object} dados - { veiculo, motorista, motivo }
 * @returns {Promise<boolean>} true se enviou
 */
async function enviarEmailDesistencia(locadorEmail, dados) {
  const { veiculo, motorista, motivo } = dados;
  const motivoTexto = MOTIVOS_DESISTENCIA[motivo] || MOTIVOS_DESISTENCIA.outro;

  const assunto = `Desistência de interesse: ${veiculo.marca} ${veiculo.modelo} - ${motorista.nome_completo}`;
  const texto = `
Um motorista que havia demonstrado interesse no seu veículo retirou o interesse.

VEÍCULO: ${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})

MOTORISTA: ${motorista.nome_completo}

MOTIVO: ${motivoTexto}

Atualize seu painel para acompanhar os interesses ativos:
${process.env.APP_URL || 'http://localhost:3000'}/interesses-locador.html
`;

  return enviarEmail({
    to: locadorEmail,
    subject: assunto,
    text: texto.trim()
  });
}

async function enviarEmail({ to, subject, text }) {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  if (!apiKey || !fromEmail) {
    console.log('[Email] Não configurado (BREVO_API_KEY ou EMAIL_FROM ausente). E-mail não enviado.');
    return false;
  }

  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { email: fromEmail },
        to: [{ email: to }],
        subject,
        textContent: text
      },
      {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('[Email] Enviado via Brevo para', to);
    return true;
  } catch (err) {
    console.error('[Email] Erro ao enviar via Brevo:', err.response?.data || err.message);
    return false;
  }
}

module.exports = { enviarEmailInteresse, enviarEmailRecuperacao, enviarEmailDesistencia };
