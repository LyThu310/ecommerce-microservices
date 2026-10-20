export class OutboxPublisher {
  constructor({
    prisma,
    producer,
    topic
  }) {
    this.prisma = prisma;
    this.producer = producer;
    this.topic = topic;
  }

  async publishPending(
    limit = 20
  ) {
    const events =
      await this.prisma.outboxEvent.findMany({
        where: {
          status: "PENDING",
          eventtype: "OrderCreated"
        },

        orderBy: {
          createdat: "asc"
        },

        take: limit
      });

    for (const event of events) {
      const message = {
        eventId:
          event.eventid,

        eventType:
          event.eventtype,

        aggregateType:
          event.aggregatetype,

        aggregateId:
          event.aggregateid,

        occurredAt:
          event.createdat.toISOString(),

        data:
          event.payload
      };

      await this.producer.send({
        topic: this.topic,

        messages: [
          {
            key:
              event.eventid,

            value:
              JSON.stringify(
                message
              )
          }
        ]
      });

      await this.prisma.outboxEvent.update({
        where: {
          eventid:
            event.eventid
        },

        data: {
          status:
            "PUBLISHED",

          publishedat:
            new Date()
        }
      });

      console.log(
        `Published OutboxEvent ${event.eventid} for Order ${event.aggregateid}`
      );
    }

    return events.length;
  }
}