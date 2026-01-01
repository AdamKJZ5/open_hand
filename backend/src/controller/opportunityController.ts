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
