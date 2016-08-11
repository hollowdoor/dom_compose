
export default function setEvents(root, events){

    while(events.length){
        let event = events.shift();
        let element = root.querySelector(`[${event.attribute}="${event.id}"]`);
        if(element && event.event in element){
            element.addEventListener(event.event, event.listener, false);
            element.removeAttribute(event.attribute);
        }

    }
};
