const { VK } = require('vk-io');

const vk = new VK({
    token: '800ff093d43795807e105da85ea0602c8e895a80ed0507b0b1038c8114e9d38f8c9a4ba1ba3c7ceb5f921'
});

vk.updates.start().catch(console.error);

const id = 353346061;

vk.updates.on(['message_new'], async (msg) => {
    if(msg.isOutbox) {
        if(!msg.text) return;
        var text = msg.text.toLowerCase();
        var count = 0;
        var messagesId = [];
        var is_error = false;
        if(text.indexOf('дд') == 0) {
            var args = text.split('дд');
            if(!args[1] || !args[1] > 0) count = 1;
            if(args[1] > 0) count = Number(args[1]);
            await vk.api.messages.getHistory({ count: 200, peer_id: msg.peerId, offset: 1 }).then(async(res) => {
                res.items.forEach(e => {
                    var time = Number(Math.floor(new Date().getTime() / 1000)) - Number(e.date);
                    if(!e.action && e.from_id == id && messagesId.length != count && time < 86400) {
                        messagesId.push(e.id);
                    }
                });
            });
            messagesId.push(msg.id);
            console.log(messagesId);
            for (let i = 0; i < messagesId.length && is_error == false; i++) {
                const element = messagesId[i];
                await vk.api.messages.edit({ peer_id: msg.peerId, message: '&#13;', message_id: element }).catch(async(err) => {
                    console.error(err);
                    is_error = true;
                })
            }
            return await vk.api.messages.delete({ message_ids: messagesId.join(`,`), delete_for_all: 1 });
        }
    }
});
