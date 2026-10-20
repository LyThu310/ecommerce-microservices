export class ScoreDiscountPolicy {
  calculate({
    score,
    subtotal
  }) {
    const normalizedScore =
      Number(score);

    const normalizedSubtotal =
      Number(subtotal);

    if (
      !Number.isFinite(normalizedScore) ||
      normalizedScore < 0
    ) {
      throw new Error(
        "Invalid membership score"
      );
    }

    if (
      !Number.isFinite(
        normalizedSubtotal
      ) ||
      normalizedSubtotal < 0
    ) {
      throw new Error(
        "Invalid subtotal"
      );
    }

    let discountRate = 0;

    if (normalizedScore >= 1000) {
      discountRate = 0.15;
    } else if (
      normalizedScore >= 500
    ) {
      discountRate = 0.10;
    } else if (
      normalizedScore >= 100
    ) {
      discountRate = 0.05;
    }

    return Number(
      (
        normalizedSubtotal *
        discountRate
      ).toFixed(2)
    );
  }
}