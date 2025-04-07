import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import Order from '@/lib/db/models/order.model'
import { sendPurchaseReceipt } from '../../../../../emails'
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '@/lib/constant'

const stripe = new Stripe(STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature') as string,
    STRIPE_WEBHOOK_SECRET as string
  )
  console.log('event ------------------------------------------------------->>>>>>>')
  console.log('event type', event)
  if (event.type === 'charge.succeeded') {
    const charge = event.data.object
    const orderId = charge.metadata.orderId
    const email = charge.billing_details.email
    const pricePaidInCents = charge.amount
    const order = await Order.findById(orderId).populate('user', 'email')
  console.log('order------------------------------------------------------->>>>>>>')

  console.log('event order', order)

    if (order == null) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
      id: event.id,
      status: 'COMPLETED',
      email_address: email!,
      pricePaid: (pricePaidInCents / 100).toFixed(2),
    }
    await order.save()
    try {
      await sendPurchaseReceipt({ order })
    } catch (err) {
      console.log('email error', err)
    }
    return NextResponse.json({
      message: 'updateOrderToPaid was successful',
    })
  }
  return new NextResponse()
}