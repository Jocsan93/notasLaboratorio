import mongoengine


mongoengine.connect(
    db="notasLaboratorio",
    host="localhost",
    port=27017
)