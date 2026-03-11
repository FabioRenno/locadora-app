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

module.exports = { enviarEmailInteresse };
