<div className="container mx-auto p-4 space-y-6">
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold tracking-tight">Campaign Dashboard</h1>
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
      >
        {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
      </Button>
      <Button 
        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
        onClick={() => /* handle new campaign */}
      >
        <Plus className="h-4 w-4 mr-2" /> New Campaign
      </Button>
    </div>
  </div>

  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {/* Campaign cards would go here */}
  </div>
</div> 