import { BigNumber, BigNumberish } from 'ethers'
import { V1ContractName } from 'models/v1/contracts'
import { PayoutMod } from 'models/v1/mods'
import { useMemo } from 'react'

import useContractReader from './useContractReader'

/** Returns queued payout mods for project with `projectId`. `queuedConfigured`: configured property of queued funding cycle. */
export default function useQueuedPayoutModsOfProject(
  projectId: BigNumberish | undefined,
  queuedConfigured: BigNumberish | undefined,
) {
  return useContractReader<PayoutMod[]>({
    contract: V1ContractName.ModStore,
    functionName: 'payoutModsOf',
    args:
      projectId && queuedConfigured
        ? [
            BigNumber.from(projectId).toHexString(),
            BigNumber.from(queuedConfigured).toHexString(),
          ]
        : null,
    updateOn: useMemo(
      () =>
        projectId && queuedConfigured
          ? [
              {
                contract: V1ContractName.ModStore,
                eventName: 'SetPayoutMod',
                topics: [
                  BigNumber.from(projectId).toHexString(),
                  BigNumber.from(queuedConfigured).toHexString(),
                ],
              },
            ]
          : [],
      [projectId, queuedConfigured],
    ),
  })
}
