const requireActivePremium = (req, res, next) => {
  const user = req.user;
  const hasLifetimeAccess = user?.subscriptionType === "lifetime";
  const hasValidPeriod = user?.premiumUntil && user.premiumUntil > new Date();
  const hasActivePremium = Boolean(
    user?.isPremium && (hasLifetimeAccess || hasValidPeriod),
  );

  if (!hasActivePremium) {
    return res.status(403).json({
      success: false,
      message: "Abonnement Premium requis ou expiré.",
    });
  }

  next();
};

export default requireActivePremium;
