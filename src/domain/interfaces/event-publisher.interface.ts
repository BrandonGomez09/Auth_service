export interface IEventPublisher {
  publish(eventName: string, data: any): Promise<void>;
  publishBatch(events: Array<{ eventName: string; data: any }>): Promise<void>;
}
