const mailchimp = require("@mailchimp/mailchimp_transactional")("LaIttCW45DipLzCyeGLZoA");
const Mailchimp = require("@mailchimp/mailchimp_marketing")
const listId = '244a27d511';

async function addMember(payload) {
  try {
    Mailchimp.setConfig({
      apiKey: 'ccca33f6d251927af92fc279cc6ae4c8-us1',
      server: 'us1',
    });
    const response = await Mailchimp.lists.addListMember(
      listId,
      {
        email_address: payload.email,
        status: 'subscribed',
        full_name: payload.name,
        timestamp_signup: new Date().toISOString().slice(0, 19) + 'Z',
        // tags: ['Registered']
        tags: ['Manual Sign-up','Registered','Welcome']
     

      }
    );
    return response;
  } catch (error) {
    console.log("------ERROR---------", error, '---------ERROR-------------');
  }
}

async function editMember(payload) {
  try {
    Mailchimp.setConfig({
      apiKey: 'ccca33f6d251927af92fc279cc6ae4c8-us1',
      server: 'us1',
    });

    const { id, tags } = payload

    const response = await Mailchimp.lists.getListMember(
      listId,
      id
    );
    const existingTags = response.tags.map((tag) => tag.name);
    const allUniqueTags = [...new Set([...existingTags, ...tags])];
    const formattedTags = allUniqueTags.map((tag) => {
      return {
        name: tag,
        status: 'active',
      };
    });

    await Mailchimp.lists.updateListMemberTags(
      listId,
      id,
      {
        tags: formattedTags,
      }
    );
    return {};
  } catch (error) {
    console.log(error)
  }
}

async function addSocialMember(payload) {
  try {
    Mailchimp.setConfig({
      apiKey: 'ccca33f6d251927af92fc279cc6ae4c8-us1',
      server: 'us1',
    });
    const response = await Mailchimp.lists.addListMember(
      listId,
      {
        email_address: payload.email,
        status: 'subscribed',
        full_name: payload.name,
        timestamp_signup: new Date().toISOString().slice(0, 19) + 'Z',
        // tags: ['Registered', 'Welcome']
        tags: ['Google Sign-up','Registered', 'Welcome']
      }
    );
    return response;
  } catch (error) {
    console.log("------ERROR---------", error, '---------ERROR-------------');
  }
}

async function sendTemplate(payload) {
  try {
    const response = await mailchimp.messages.sendTemplate({
      template_name: payload.templateName,
      template_content: [{}],
      message: {
        to: [{
          email: payload.email
        }],
        from_email: 'noreply@artyst.ai',
        subject: payload.subject,
        merge_language: 'mailchimp',
        headers: {
          'Reply-To': 'noreply@artyst.ai'
        },
        global_merge_vars: payload.variables
      },
    });
    console.log(response, "-------<>-----");
    return response;
  } catch (error) {
    console.log("------ERROR---------", error, '---------ERROR-------------');
  }
}

async function getMember(payload) {
  try {
    Mailchimp.setConfig({
      apiKey: 'ccca33f6d251927af92fc279cc6ae4c8-us1',
      server: 'us1',
    });
    const response = await Mailchimp.lists.getListMember(
      listId,
      payload.mailchimpId
    );
    return response;
  } catch (error) {
  }
}


async function mailSendContactPage(payload) {
  try {
    Mailchimp.setConfig({
      apiKey: 'ccca33f6d251927af92fc279cc6ae4c8-us1',
      server: 'us1',
    });
    const response = await Mailchimp.lists.addListMember(
      listId,
      {
        email_address: payload.email,
        full_name: payload.name,
        full_description: payload.description,
        status: 'subscribed',
        timestamp_signup: new Date().toISOString().slice(0, 19) + 'Z',
        tags: ['Contact Us']

      }
    );
    return response;
  } catch (error) {
    console.log("------ERROR---------", error, '---------ERROR-------------');
  }
}


async function sendTemplateContact(payload) {
 
  try {
    const response = await mailchimp.messages.sendTemplate({
      template_name: payload.templateName,
      name: payload.name,
      description: payload.description,
      template_content: [{}],
      message: {
        to: [{
          email: payload.email,
 
        }],
        from_email: 'support@artyst.ai',
        subject: payload.subject,
        merge_language: 'mailchimp',
        headers: {
          'Reply-To': 'support@artyst.ai,'
        },
        global_merge_vars: payload.variables
      },
    });
    console.log(response, "-------<>-----");
    return response;
  } catch (error) {
    console.log("------ERROR---------", error, '---------ERROR-------------');
  }
}






module.exports = { addMember, editMember, addSocialMember, sendTemplate, getMember,mailSendContactPage,sendTemplateContact}
