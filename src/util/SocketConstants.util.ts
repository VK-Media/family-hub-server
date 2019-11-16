export const eventConstants = {
	EVENT_CREATED: 'EVENT_CREATED',
	EVENT_UPDATED: 'EVENT_UPDATED',
	EVENT_DELETED: 'EVENT_DELETED'
}

// NOTE: Maybe these constants can be appended by some id so that client can be dynamicly set up in order not to recieve events for everything that isn't
// relevant for them. A user client app does not care about events not related to their family for example

export const demoConstants = {
	NEWS: 'NEWS',
	OTHER_EVENT: 'OTHER_EVENT'
}
