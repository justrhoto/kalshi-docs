---
url: https://docs.kalshi.com/margin-ws/websockets/exchange-status
---
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.kalshi.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Exchange Status

> Sent when trading is paused or resumed exchange-wide, or when the exchange status changes.
Trading messages carry `trading_active`. Exchange status messages carry `exchange_active`.
Both flags mean the same as in `GET /trade-api/v2/margin/exchange/status`,
and trading is open exchange-wide only while both are true. A message can repeat the current
value. Per-market halts and trading-hours closes are sent on `market_lifecycle_v2`, not on this
channel; a market is open only while both channels show it open.




## AsyncAPI

````yaml perps_asyncapi.yaml exchange_status
id: exchange_status
title: Exchange Status
description: >
  Sent when trading is paused or resumed exchange-wide, or when the exchange
  status changes.

  Trading messages carry `trading_active`. Exchange status messages carry
  `exchange_active`.

  Both flags mean the same as in `GET /trade-api/v2/margin/exchange/status`,

  and trading is open exchange-wide only while both are true. A message can
  repeat the current

  value. Per-market halts and trading-hours closes are sent on
  `market_lifecycle_v2`, not on this

  channel; a market is open only while both channels show it open.
servers:
  - id: production
    protocol: wss
    host: external-api-margin-ws.kalshi.com
    bindings: []
    variables: []
  - id: demo
    protocol: wss
    host: external-api-margin-ws.demo.kalshi.co
    bindings: []
    variables: []
address: exchange_status
parameters: []
bindings: []
operations:
  - &ref_0
    id: receiveExchangeStatus
    title: Receive Exchange Status
    type: send
    messages:
      - &ref_1
        id: exchangeStatus
        contentType: application/json
        payload:
          - name: Exchange Status
            description: Exchange-wide trading and exchange status changes
            type: object
            properties:
              - name: type
                type: string
                description: exchange_status
                required: true
              - name: sid
                type: integer
                description: >-
                  Server-generated subscription identifier (sid) used to
                  identify the channel
                required: true
              - name: seq
                type: integer
                description: >-
                  Sequential number that should be checked if you want to
                  guarantee you received all the messages. Used for
                  snapshot/delta consistency
                required: true
              - name: msg
                type: object
                required: true
                properties:
                  - name: exchange_active
                    type: boolean
                    description: >-
                      False while the exchange is paused and accepts no state
                      changes. Present on exchange status messages.
                    required: false
                  - name: trading_active
                    type: boolean
                    description: >-
                      False while trading is paused exchange-wide; trading is
                      open only while both this and `exchange_active` are true.
                      Present on trading messages.
                    required: false
                  - name: ts_ms
                    type: integer
                    description: >-
                      Unix timestamp in milliseconds when the exchange published
                      the change.
                    required: true
              - name: sending_ts_ms
                type: integer
                description: >-
                  Unix timestamp in milliseconds when Kalshi queued this message
                  at the network layer.
                required: false
        headers: []
        jsonPayloadSchema:
          type: object
          required:
            - type
            - sid
            - seq
            - msg
          properties:
            type:
              type: string
              const: exchange_status
              x-parser-schema-id: <anonymous-schema-135>
            sid:
              type: integer
              description: >-
                Server-generated subscription identifier (sid) used to identify
                the channel
              minimum: 1
              x-parser-schema-id: subscriptionId
            seq:
              type: integer
              description: >-
                Sequential number that should be checked if you want to
                guarantee you received all the messages. Used for snapshot/delta
                consistency
              minimum: 1
              x-parser-schema-id: sequenceNumber
            msg:
              type: object
              required:
                - ts_ms
              properties:
                exchange_active:
                  type: boolean
                  description: >-
                    False while the exchange is paused and accepts no state
                    changes. Present on exchange status messages.
                  x-parser-schema-id: <anonymous-schema-137>
                trading_active:
                  type: boolean
                  description: >-
                    False while trading is paused exchange-wide; trading is open
                    only while both this and `exchange_active` are true. Present
                    on trading messages.
                  x-parser-schema-id: <anonymous-schema-138>
                ts_ms:
                  type: integer
                  format: int64
                  description: >-
                    Unix timestamp in milliseconds when the exchange published
                    the change.
                  x-parser-schema-id: <anonymous-schema-139>
              x-parser-schema-id: <anonymous-schema-136>
            sending_ts_ms:
              type: integer
              format: int64
              description: >-
                Unix timestamp in milliseconds when Kalshi queued this message
                at the network layer.
              x-parser-schema-id: sendingTimestampMs
          x-parser-schema-id: marginExchangeStatusPayload
        title: Exchange Status
        description: Exchange-wide trading and exchange status changes
        example: |-
          {
            "type": "exchange_status",
            "sending_ts_ms": 1733047200123,
            "sid": 3,
            "seq": 1,
            "msg": {
              "trading_active": false,
              "ts_ms": 1733047200000
            }
          }
        bindings: []
        extensions:
          - id: x-parser-unique-object-id
            value: exchangeStatus
    bindings: []
    extensions:
      - id: x-parser-unique-object-id
        value: exchange_status
sendOperations: []
receiveOperations:
  - *ref_0
sendMessages: []
receiveMessages:
  - *ref_1
extensions:
  - id: x-parser-unique-object-id
    value: exchange_status
securitySchemes:
  - id: apiKey
    name: apiKey
    type: apiKey
    description: API key authentication required for margin WebSocket connections.
    in: user
    extensions: []

````

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.