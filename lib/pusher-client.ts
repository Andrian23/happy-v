import Pusher from "pusher-js"

type PusherEventData = {
  message?: string
  updatedUserId?: string
  [key: string]: unknown
}

let pusherInstance: Pusher | null = null
const subscribedChannels: Record<string, boolean> = {}

export function getPusherInstance(): Pusher {
  if (!pusherInstance) {
    try {
      pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      })
    } catch (error) {
      console.error("Error initializing Pusher:", error)
      throw error
    }
  }
  return pusherInstance
}

export function subscribeToChannel(channelName: string) {
  try {
    const pusher = getPusherInstance()
    if (!subscribedChannels[channelName]) {
      pusher.subscribe(channelName)
      subscribedChannels[channelName] = true
    }
    return pusher.channel(channelName)
  } catch (error) {
    console.error(`Error subscribing to channel ${channelName}:`, error)
    throw error
  }
}

export function bindToEvent(channelName: string, eventName: string, callback: (data: PusherEventData) => void) {
  const channel = subscribeToChannel(channelName)
  channel.bind(eventName, callback)

  return () => {
    try {
      channel.unbind(eventName, callback)
    } catch (error) {
      console.error(`Error unbinding event ${eventName} from channel ${channelName}:`, error)
    }
  }
}
