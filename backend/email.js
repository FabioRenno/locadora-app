/**
 * Envio de e-mail (opcional)
 *
 * Configura via variáveis de ambiente:
 *   EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
 *
 * Se não configurado, não envia (não causa erro).
 */

const nodemailer = require('nodemailer');

function getTransport() {
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: host,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: { user, pass }
  });
}

/**
 * Envia e-mail ao locador quando um motorista manifesta interesse
 * @param {string} locadorEmail - E-mail do locador
 * @param {object} dados - { veiculo, motorista }
 * @returns {Promise<boolean>} true se enviou, false se não configurado ou erro
 */
async function enviarEmailInteresse(locadorEmail, dados) {
  const transport = getTransport();
  if (!transport) {
    console.log('[Email] Não configurado. Interesse salvo, mas e-mail não enviado.');
    return false;
  }

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

  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: locadorEmail,
      subject: assunto,
      text: texto.trim()
    });
    console.log('[Email] Notificação enviada para', locadorEmail);
    return true;
  } catch (err) {
    console.error('[Email] Erro ao enviar:', err.message);
    return false;
  }
}

/**
 * Envia e-mail de recuperação de senha com link para redefinir
 * @param {string} para - E-mail do destinatário
 * @param {string} token - Token único para a redefinição
 * @param {string} tipo - 'locador' ou 'motorista'
 * @returns {Promise<boolean>} true se enviou
 */
async function enviarEmailRecuperacao(para, token, tipo) {
  const transport = getTransport();
  if (!transport) {
    return false;
  }

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

  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: para,
      subject: assunto,
      text: texto.trim()
    });
    console.log('[Email] Recuperação de senha enviada para', para);
    return true;
  } catch (err) {
    console.error('[Email] Erro ao enviar recuperação:', err.message);
    return false;
  }
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
  const transport = getTransport();
  if (!transport) {
    console.log('[Email] Não configurado. Desistência salva, mas e-mail não enviado.');
    return false;
  }

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

  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: locadorEmail,
      subject: assunto,
      text: texto.trim()
    });
    console.log('[Email] Desistência enviada para', locadorEmail);
    return true;
  } catch (err) {
    console.error('[Email] Erro ao enviar desistência:', err.message);
    return false;
  }
}

module.exports = { enviarEmailInteresse, enviarEmailRecuperacao, enviarEmailDesistencia };
