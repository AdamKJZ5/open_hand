export const createOpportunity = async (req: any, res: any) => {
  try {
    const {title, description, location, date} = req.body;

    const newOpp = new Opportunity({
    
    title,
    description,
    location,
    date,
    createdBy: req.user.id
    });

    const savedOpp = await newOpp.save();
    res.status(201).json(savedOpp);
  } catch (error) {
    res.status(400).json({ message: "Failed to create opportunity"});
  }
};

export const applyToOpportunity = async (req: any, res: any) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { volunteers: req.user.id } }, // Adds user ID only if not already there
      { new: true }
    );
    res.json(opportunity);
  } catch (error) {
    res.status(400).json({ message: "Could not apply" });
  }
};
