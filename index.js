const { Plugin } = require('powercord/entities');
const { getModule, channels: { getChannelId } } = require('powercord/webpack');

module.exports = class Edit extends Plugin {
  async startPlugin () {
    const queue = await getModule(x => x.enqueue);
    const { editMessage } = await getModule([ 'editMessage', 'sendMessage' ]);
    powercord.api.commands.registerCommand({
      command: 'edit',
      description: 'Send messages, editing in each letter',
      usage: '{c} <message>',
      executor: (args) => {
        const channel = getChannelId();
        const msg = args.join(' ').split('');
        let current = msg[0];
        let yes = '';
        queue.enqueue({ message: { content: current,
          channelId: channel },
        type: 0
        }, m => {
          msg.shift();
          msg.forEach((e, i) => {
            setTimeout(() => {
              if (e === ' ') {
                yes = ' ';
                return;
              }
              editMessage(m.body.channel_id, m.body.id, { content: current + yes + e,
                channelId: channel });
              current = current + yes + e;
              yes = '';
            }, 800 * i);
          });
        }
        );
      }
    });
  }

  pluginWillUnload () {
    powercord.api.commands.unregisterCommand('edit');
  }
};
