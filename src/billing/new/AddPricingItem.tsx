import React from 'react'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'

const AddPricingItem = () => {
  const breadcrumbs = [
    {
      i18nKey: 'billing.requests.new',
      location: '/billing/new',
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  return <p />
}

export default AddPricingItem
