\# Recovery Actions and Safety Rules



\## Recovery action mapping



| Failure reason | Suggested action | Explanation |

|---|---|---|

| insufficient\_funds | retry\_later | The customer may need time to add funds |

| expired\_card | send\_payment\_link | The customer can use another payment method |

| bank\_timeout | retry\_later | A temporary bank or network problem may resolve |

| authentication\_failure | send\_payment\_link | The customer can retry authentication |

| invalid\_account | manual\_review | The account information may be incorrect |

| daily\_limit\_exceeded | retry\_later | The payment limit may reset later |

| suspected\_fraud | manual\_review | Suspicious payments must not be retried automatically |

| technical\_error | retry\_later | A temporary system problem may resolve |



\## Safety rules



\### Rule 1: Suspected fraud



Never automatically retry a payment marked as `suspected\_fraud`.



Final action:



```text

manual\_review

